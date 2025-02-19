import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { User } from '../users/models/user.model';
import { IGqlContext } from '@jobs-system/nestjs';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters and return the result', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockContext: IGqlContext = {
        res: {
          cookie: jest.fn(),
        } as any,
        req: {} as any,
      };

      const expectedUser: Partial<User> = {
        id: 1,
        email: loginInput.email,
      };

      mockAuthService.login.mockResolvedValue(expectedUser);

      // Act
      const result = await resolver.login(loginInput, mockContext);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        loginInput,
        mockContext.res
      );
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error when login fails', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const mockContext: IGqlContext = {
        res: {
          cookie: jest.fn(),
        } as any,
        req: {} as any,
      };

      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.login(loginInput, mockContext)).rejects.toThrow(
        error
      );
      expect(authService.login).toHaveBeenCalledWith(
        loginInput,
        mockContext.res
      );
    });
  });
});
