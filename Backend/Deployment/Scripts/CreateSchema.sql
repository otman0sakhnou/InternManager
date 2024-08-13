﻿USE InternManagerDb

Go
IF NOT EXISTS (SELECT * 
               FROM sys.objects 
               WHERE object_id = OBJECT_ID(N'[dbo].[AspNetRoles]') 
               AND type = N'U')
BEGIN
CREATE TABLE AspNetRoles (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    Name NVARCHAR(256) NULL,
    NormalizedName NVARCHAR(256) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL
);

CREATE TABLE AspNetUsers (
    Id NVARCHAR(450) NOT NULL PRIMARY KEY,
    UserName NVARCHAR(256) NULL,
    NormalizedUserName NVARCHAR(256) NULL,
    Email NVARCHAR(256) NULL,
    NormalizedEmail NVARCHAR(256) NULL,
    EmailConfirmed BIT NOT NULL,
    PasswordHash NVARCHAR(MAX) NULL,
    SecurityStamp NVARCHAR(MAX) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL,
    PhoneNumber NVARCHAR(MAX) NULL,
    PhoneNumberConfirmed BIT NOT NULL,
    TwoFactorEnabled BIT NOT NULL,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL,
    AccessFailedCount INT NOT NULL
);
CREATE TABLE AspNetRoleClaims (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    RoleId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    CONSTRAINT FK_AspNetRoleClaims_AspNetRoles_RoleId FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserClaims (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    CONSTRAINT FK_AspNetUserClaims_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserLogins (
    LoginProvider NVARCHAR(450) NOT NULL,
    ProviderKey NVARCHAR(450) NOT NULL,
    ProviderDisplayName NVARCHAR(MAX) NULL,
    UserId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    CONSTRAINT FK_AspNetUserLogins_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);


CREATE TABLE AspNetUserRoles (
    UserId NVARCHAR(450) NOT NULL,
    RoleId NVARCHAR(450) NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_AspNetUserRoles_AspNetRoles_RoleId FOREIGN KEY (RoleId) REFERENCES AspNetRoles(Id) ON DELETE CASCADE,
    CONSTRAINT FK_AspNetUserRoles_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE AspNetUserTokens (
    UserId NVARCHAR(450) NOT NULL,
    LoginProvider NVARCHAR(450) NOT NULL,
    Name NVARCHAR(450) NOT NULL,
    Value NVARCHAR(MAX) NULL,
    PRIMARY KEY (UserId, LoginProvider, Name),
    CONSTRAINT FK_AspNetUserTokens_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);
CREATE TABLE RefreshTokens(
   Token NVARCHAR(450) NOT NULL PRIMARY KEY,
    UserId NVARCHAR(450) NULL,
    ExpirationDate DATETIME2 NOT NULL,
    IsRevoked BIT NOT NULL,
    CONSTRAINT FK_RefreshTokens_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);


CREATE TABLE Logs (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserId NVARCHAR(450) NULL,
    Action NVARCHAR(MAX) NULL,
    Timestamp DATETIME2 NOT NULL,
    Description NVARCHAR(MAX) NULL
);


CREATE TABLE Collaborators (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NULL,
    Phone NVARCHAR(MAX) NULL,
    Title NVARCHAR(MAX) NULL,
    Department NVARCHAR(MAX) NULL,
    Organization NVARCHAR(MAX) NULL,
    EmploymentDate DATETIME2 NOT NULL,
    Gender NVARCHAR(MAX) NULL,
    UserId NVARCHAR(450) NULL,
    CONSTRAINT FK_Collaborators_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE Interns (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NULL,
    Phone NVARCHAR(MAX) NULL,
    Institution NVARCHAR(MAX) NULL,
    Level NVARCHAR(MAX) NULL,
    Gender NVARCHAR(MAX) NULL,
    Specialization NVARCHAR(MAX) NULL,
    YearOfStudy INT NOT NULL,
    Title NVARCHAR(MAX) NULL,
    Department NVARCHAR(MAX) NULL,
    UserId NVARCHAR(450) NULL,
    CONSTRAINT FK_Interns_AspNetUsers_UserId FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE CASCADE
);

CREATE TABLE Groups (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Name NVARCHAR(MAX) NULL,
    Description NVARCHAR(MAX) NULL,
    ExpirationDate DATETIME2 NOT NULL,
    Department NVARCHAR(MAX) NULL,
    CollaboratorId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Groups_Collaborators_CollaboratorId FOREIGN KEY (CollaboratorId) REFERENCES Collaborators(Id) ON DELETE CASCADE
);

CREATE TABLE Periods (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    InternId UNIQUEIDENTIFIER NOT NULL,
    GroupId UNIQUEIDENTIFIER NULL,
    CONSTRAINT FK_Periods_Groups_GroupId FOREIGN KEY (GroupId) REFERENCES Groups(Id) ON DELETE NO ACTION ,
    CONSTRAINT FK_Periods_Interns_InternId FOREIGN KEY (InternId) REFERENCES Interns(Id) ON DELETE CASCADE
);

CREATE TABLE Subjects (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Title NVARCHAR(MAX) NULL,
    Type NVARCHAR(MAX) NULL,
    Description NVARCHAR(MAX) NULL,
    GroupId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Subjects_Groups_GroupId FOREIGN KEY (GroupId) REFERENCES Groups(Id) ON DELETE CASCADE
);

CREATE  TABLE  Steps (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Description NVARCHAR(MAX) NULL,
    SubjectId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Steps_Subjects_SubjectId FOREIGN KEY (SubjectId) REFERENCES Subjects(Id) ON DELETE CASCADE
);

CREATE TABLE InternSteps (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Status NVARCHAR(MAX) NULL,
    StepId UNIQUEIDENTIFIER NOT NULL,
    InternId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_InternSteps_Interns_InternId FOREIGN KEY (InternId) REFERENCES Interns(Id) ON DELETE CASCADE ,
    CONSTRAINT FK_InternSteps_Steps_StepId FOREIGN KEY (StepId) REFERENCES Steps(Id) ON DELETE NO ACTION
);

CREATE TABLE [dbo].[VersionInfo] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Version] INT NOT NULL,
    [AppliedOn] DATETIME2 NOT NULL,
    [Description] NVARCHAR(255) NULL
);
END;