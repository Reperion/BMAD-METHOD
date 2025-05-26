# User Authentication Sequence Diagram

This sequence diagram details the process of a user logging into the system, including successful and failed attempts.

```mermaid
sequenceDiagram
    participant User
    participant ClientApp
    participant AuthService
    participant Database

    User->>ClientApp: Enters Credentials
    ClientApp->>AuthService: POST /login
    AuthService->>Database: Query User by Email
    Database-->>AuthService: User Data or Not Found

    alt Successful Login
        AuthService->>AuthService: Verify Password
        AuthService->>ClientApp: 200 OK, JWT Token
        ClientApp->>User: Login Successful, Redirect to Dashboard
    else Invalid Credentials
        AuthService->>ClientApp: 401 Unauthorized, Error Message
        ClientApp->>User: Display "Invalid Credentials"
    end

    alt Token Expiration / Refresh
        ClientApp->>AuthService: POST /refresh-token
        AuthService->>AuthService: Validate Refresh Token
        AuthService->>ClientApp: 200 OK, New JWT Token
    else Invalid Refresh Token
        AuthService->>ClientApp: 401 Unauthorized, Redirect to Login
    end
