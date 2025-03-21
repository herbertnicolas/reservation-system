const validateRoomData = (req, res, next) => {
    const { identificador, capacidade } = req.body;
  
    if (typeof identificador !== 'string') {
      return res.status(400).json({ error: "Identificador deve ser uma string!" });
    }
  
    if (typeof capacidade !== 'number') {
      return res.status(400).json({ error: "Capacidade deve ser um número!" });
    }
  
    next(); 
  };
  
module.exports = validateRoomData;