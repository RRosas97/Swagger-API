const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next)=> {
    const authHeader = req.headers['authorization'];   
    const token = authHeader && authHeader.split(' ')[1];   
    if (!token) return res.status(401).json({ message: 'No se ha enviado token desde el cliente' });   
    
    jwt.verify(token, 'your_secret_key', (err, user) => {     
        if (err) return res.status(403).json({ message: 'El token actual no es válido' }); 
            req.user = user; next(); 
    });
        
};

module.exports = authenticateToken