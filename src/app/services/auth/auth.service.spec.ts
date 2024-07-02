import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();  
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save user data to localStorage', () => {
    const userData = {
      username: 'testuser',
      id: '123',
      team: 'TeamA',
      team_id: '456'
    };

    service.saveUser(userData);

    const storedUser = JSON.parse(localStorage.getItem('user')!);
    expect(storedUser).toEqual({
      username: 'testuser',
      id: '123',
      teamName: 'TeamA',
      teamId: '456'
    });
  });

  it('should get user data from localStorage', () => {
    const userData = {
      username: 'testuser',
      id: '123',
      teamName: 'TeamA',
      teamId: '456'
    };
    localStorage.setItem('user', JSON.stringify(userData));

    const user = service.getUser();
    expect(user).toEqual(userData);
  });

  it('should delete user data from localStorage', () => {
    const userData = {
      username: 'testuser',
      id: '123',
      teamName: 'TeamA',
      teamId: '456'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    service.deleteUser();
    expect(localStorage.getItem('user')).toBeNull();
  });
});