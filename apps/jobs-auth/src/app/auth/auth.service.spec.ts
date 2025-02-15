import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../users/interfaces/user.interface';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      const config = {
        JWT_EXPIRATION_MS: '3600000',
        NODE_ENV: 'development',
      };
      return config[key];
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  const mockUsersService = {
    getUser: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockLoginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser: Partial<IUser> = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    it('should successfully login a user with valid credentials', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.login(mockLoginInput, mockResponse);

      // Assert
      expect(result).toEqual(mockUser);
      expect(usersService.getUser).toHaveBeenCalledWith({
        email: mockLoginInput.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginInput.password,
        mockUser.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        'mock.jwt.token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
        })
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(mockLoginInput, mockResponse)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(mockLoginInput, mockResponse)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should set secure cookie in production environment', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        const config = {
          JWT_EXPIRATION_MS: '3600000',
          NODE_ENV: 'production',
        };
        return config[key];
      });

      // Act
      await service.login(mockLoginInput, mockResponse);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        'mock.jwt.token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
        })
      );
    });
  });

  describe('verifyUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockUser: Partial<IUser> = {
      id: 1,
      email,
      password: 'hashedPassword',
    };

    it('should successfully verify user with valid credentials', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service['verifyUser'](email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(usersService.getUser).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(null);

      // Act & Assert
      await expect(service['verifyUser'](email, password)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockUsersService.getUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service['verifyUser'](email, password)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when getUser throws an error', async () => {
      // Arrange
      mockUsersService.getUser.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service['verifyUser'](email, password)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
