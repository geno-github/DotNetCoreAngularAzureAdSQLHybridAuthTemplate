CREATE TABLE [dbo].[AppUser]
(
	[Id] INT IDENTITY (1,1) NOT NULL, 
	[NetworkId] NVARCHAR(64) NOT NULL,
	[DisplayName] NVARCHAR(MAX) NULL,
	[CompanyName] NVARCHAR(MAX) NULL,
	[UserRoleId] INT NOT NULL,
    [IsActive] BIT DEFAULT (1) NOT NULL, 
    [CreatedBy] INT CONSTRAINT [DF_User_CreatedBy] DEFAULT ('0') NOT NULL,
    [CreatedOn]        DATETIME      CONSTRAINT [DF_User_CreatedOn] DEFAULT (GETDATE()) NOT NULL,    
    [LastModifiedDate] DATETIME      NULL,
    [LastModifiedBy]   INT  NULL,
	[LastLoggedInDate] DATETIME      NULL,
    CONSTRAINT [PK_User_ID] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_UserRoleId] FOREIGN KEY ([UserRoleId]) REFERENCES [dbo].[UserRole] ([Id])
)

GO

CREATE INDEX [IX_AppUser_NetworkId] ON [dbo].[AppUser] ([NetworkId])
