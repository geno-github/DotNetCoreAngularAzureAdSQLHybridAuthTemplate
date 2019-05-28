CREATE TABLE [dbo].[UserRole]
(
	[Id] INT IDENTITY NOT NULL PRIMARY KEY, 
    [RoleName] NVARCHAR(16) NOT NULL,	
    [IsActive] BIT DEFAULT (1) NOT NULL, 
    [CreatedBy] INT CONSTRAINT [DF_UserRole_CreatedBy] DEFAULT ('0') NOT NULL,
    [CreatedOn]        DATETIME      CONSTRAINT [DF_UserRole_CreatedOn] DEFAULT (GETDATE()) NOT NULL,    
    [LastModifiedDate] DATETIME      NULL,
    [LastModifiedBy]   INT NULL,
)
