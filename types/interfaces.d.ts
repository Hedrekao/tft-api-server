interface RegisterDto {
  email: string;
  password: string;
  userName: string?;
  summonerName: string?;
  region: string?;
}

interface LoginDto {
  email: string;
  password: string;
}
