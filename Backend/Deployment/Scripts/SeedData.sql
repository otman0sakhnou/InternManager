-- Insert sample data into AspNetRoles
INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
VALUES
('1', 'Admin', 'ADMIN', 'stamp-admin'),
('2', 'Manager', 'MANAGER', 'stamp-manager'),
('3', 'Collaborator', 'COLLABORATOR', 'stamp-collaborator'),
('4', 'Intern', 'INTERN', 'stamp-intern');

-- Insert sample data into AspNetUsers
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount)
VALUES
('1', 'admin', 'ADMIN', 'admin@example.com', 'ADMIN@EXAMPLE.COM', 1, 'hashedPassword', 'securityStamp', 'concurrencyStamp', '1234567890', 1, 0, NULL, 1, 0),
('2', 'user', 'USER', 'user@example.com', 'USER@EXAMPLE.COM', 1, 'hashedPassword', 'securityStamp', 'concurrencyStamp', '0987654321', 1, 0, NULL, 1, 0);

-- Insert sample data into Collaborators
INSERT INTO Collaborators (Id, Name, Phone, Title, Department, Organization, EmploymentDate, Gender, UserId)
VALUES
(NEWID(), 'John Doe', '1234567890', 'Developer', 'IT', 'TechCorp', '2023-01-01', 'Male', '1'),
(NEWID(), 'Jane Smith', '0987654321', 'Manager', 'HR', 'BusinessInc', '2022-06-15', 'Female', '2');

-- Insert sample data into Groups
INSERT INTO Groups (Id, Name, Description, ExpirationDate, Department, CollaboratorId)
VALUES
(NEWID(), 'Group A', 'Description for Group A', '2024-12-31', 'IT', (SELECT Id FROM Collaborators WHERE Name = 'John Doe')),
(NEWID(), 'Group B', 'Description for Group B', '2024-06-30', 'HR', (SELECT Id FROM Collaborators WHERE Name = 'Jane Smith'));

-- Insert sample data into Interns
INSERT INTO Interns (Id, Name, Phone, Institution, Level, Gender, Specialization, YearOfStudy, Title, Department, UserId)
VALUES
(NEWID(), 'Alice Johnson', '1234567890', 'University A', 'Undergraduate', 'Female', 'Computer Science', 2, 'Intern', 'IT', '1'),
(NEWID(), 'Bob Brown', '0987654321', 'University B', 'Postgraduate', 'Male', 'Business Administration', 1, 'Intern', 'HR', '2');

-- Insert sample data into Subjects
INSERT INTO Subjects (Id, Title, Type, Description, GroupId)
VALUES
(NEWID(), 'Subject 1', 'Type A', 'Description for Subject 1', (SELECT Id FROM Groups WHERE Name = 'Group A')),
(NEWID(), 'Subject 2', 'Type B', 'Description for Subject 2', (SELECT Id FROM Groups WHERE Name = 'Group B'));

-- Insert sample data into Steps
INSERT INTO Steps (Id, Description, SubjectId)
VALUES
(NEWID(), 'Step 1 Description', (SELECT Id FROM Subjects WHERE Title = 'Subject 1')),
(NEWID(), 'Step 2 Description', (SELECT Id FROM Subjects WHERE Title = 'Subject 2'));

-- Insert sample data into Periods
INSERT INTO Periods (Id, StartDate, EndDate, InternId, GroupId)
VALUES
(NEWID(), '2024-01-01', '2024-03-31', (SELECT Id FROM Interns WHERE Name = 'Alice Johnson'), (SELECT Id FROM Groups WHERE Name = 'Group A')),
(NEWID(), '2024-04-01', '2024-06-30', (SELECT Id FROM Interns WHERE Name = 'Bob Brown'), (SELECT Id FROM Groups WHERE Name = 'Group B'));

-- Insert sample data into InternSteps
INSERT INTO InternSteps (Id, Status, StepId, InternId)
VALUES
(NEWID(), 'Completed', (SELECT Id FROM Steps WHERE Description = 'Step 1 Description'), (SELECT Id FROM Interns WHERE Name = 'Alice Johnson')),
(NEWID(), 'InProgress', (SELECT Id FROM Steps WHERE Description = 'Step 2 Description'), (SELECT Id FROM Interns WHERE Name = 'Bob Brown'));
