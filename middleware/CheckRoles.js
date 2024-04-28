export const checkRole = (requiredRole) => (req, res, next) => {
  try {
      const tokenData = req.tokenData;
    //   console.log("in role teokendata: ",tokenData);
      const roles = tokenData.realm_access.roles;

    //   console.log("roles are: ",roles);

      if (!roles.includes(requiredRole)) {
          // Throw error if user does not have the required role
          const error = new Error(`Access Denied: You do not have the '${requiredRole}' role.`);
          error.statusCode = 401;
          throw error;
      }
      // If user has the required role, proceed
      next();
  } catch (error) {
      next(error);
  }
};
