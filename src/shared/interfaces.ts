export interface AuthProps {
  isAuthorized: boolean;
  isLoaded: boolean;
  onLogout(): Promise<void>;
}
