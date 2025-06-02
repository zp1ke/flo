<#-- @ftlvariable name="user" type="com.zp1ke.flo.data.domain.User" -->
<#-- @ftlvariable name="profile" type="com.zp1ke.flo.data.domain.Profile" -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello ${profile.name}, please verify your email address</title>
</head>
<body>
<span>Please verify your email address by clicking the link below. TODO: Add verification link here with code ${user.verifyCode}.</span>
</body>
</html>