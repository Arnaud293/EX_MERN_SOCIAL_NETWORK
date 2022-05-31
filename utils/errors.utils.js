module.exports.signUpErrors = (error) => {
    let errors = { pseudo: '', email: '', password: '' }

    if (error.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà pris.";
    if (error.message.includes('email'))
        errors.email = 'Email incorrect ou déjà pris.';
    if (error.message.includes('password'))
        errors.password = 'Votre mot de passe doit contenir au minimum 6 caractères';
    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes('email'))
        errors.email = 'Cet email est déjà associé à un compte';
    if (error.code === 11000 && Object.keys(error.keyValue)[0].includes('pseudo'))
        errors.email = 'Ce pseudo est déjà associé à un compte';


    return errors;
}

module.exports.signInErrors = (error) => {
    let errors = { email: '', password: '' }

    if (error.message.includes('email'))
        errors.email = 'Email inconnu';
    if (error.message.includes('password'))
        errors.password = 'Mot de passe incorrect';

    return errors;
}