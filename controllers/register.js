const { createSession } = require('./sessionManager');

const handleRegister = async (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	
	try {
    const user = await db.transaction(async (trx) => {
      // Insert to login db table
      const loginEmail = await trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email');

      // Insert to users db table
      const user = await trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        });

      return user[0];
    });

    // session creation
    const session = await createSession(user);
    
    res.json({
      user: user,
      token: session.token,
      success: true
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json('Unable to register.');
  }
}

module.exports = {
	handleRegister: handleRegister
};