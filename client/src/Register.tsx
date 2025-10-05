import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from "axios"

const RegistrationPage: React.FC = () => {
    const {setUser} = useUser()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const passwordsMatch = password1 === password2 && password1.length > 0;
  const passwordStrength = password1.length >= 8 ? 'strong' : password1.length >= 5 ? 'medium' : 'weak';
  
  const allFieldsFilled = firstName.trim() !== '' && 
                          lastName.trim() !== '' && 
                          username.trim() !== '' && 
                          email.trim() !== '' && 
                          password1.trim() !== '' && 
                          password2.trim() !== '';
  
  const canRegister = allFieldsFilled && passwordsMatch && agreeTerms;

  const handleRegister = async () => {
    if (canRegister) {
      const userData = {
        username,
        email,
        password: password1,
        name: firstName + " " + lastName,
      };
      console.log('Registering user:', userData);
      try{
            const user =  await axios.post("http://127.0.0.1:8000/register", userData)
            setUser(user.data)
            navigate("/")

      }
      catch(error:any){
        navigate("/register")
      }
    }
  };

  const handleBack = (): void => {
    console.log('Going back to login page');
    navigate("/")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-6 py-3 mb-8 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium tracking-wide">Back to Login</span>
        </button>

        {/* Registration Card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 xl:p-12 2xl:p-16 border border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8 xl:mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <UserPlus className="w-10 h-10 xl:w-12 xl:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
              CREATE ACCOUNT
            </h1>
            <p className="text-lg xl:text-xl 2xl:text-2xl text-slate-400 font-light tracking-wide">
              Join the future marketplace today
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-6 xl:space-y-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                  <User className="inline w-4 h-4 mr-2" />
                  FIRST NAME
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-base xl:text-lg"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                  LAST NAME
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-base xl:text-lg"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                <User className="inline w-4 h-4 mr-2" />
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe123"
                className="w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-base xl:text-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                <Mail className="inline w-4 h-4 mr-2" />
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@email.com"
                className="w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-base xl:text-lg"
              />
            </div>

            {/* Password 1 */}
            <div>
              <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                <Lock className="inline w-4 h-4 mr-2" />
                PASSWORD
              </label>
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-base xl:text-lg"
              />
              {password1.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Password strength:</span>
                    <span className={`text-sm font-bold ${
                      passwordStrength === 'strong' ? 'text-emerald-400' :
                      passwordStrength === 'medium' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {passwordStrength.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === 'strong' ? 'w-full bg-gradient-to-r from-emerald-500 to-teal-500' :
                        passwordStrength === 'medium' ? 'w-2/3 bg-gradient-to-r from-amber-500 to-orange-500' :
                        'w-1/3 bg-gradient-to-r from-red-500 to-rose-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Password 2 */}
            <div>
              <label className="block text-slate-300 text-sm xl:text-base font-medium mb-3 tracking-wide">
                <Lock className="inline w-4 h-4 mr-2" />
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-6 py-4 xl:px-7 xl:py-5 2xl:px-8 2xl:py-6 bg-slate-800/50 border ${
                  password2.length > 0 && !passwordsMatch 
                    ? 'border-red-500/50 focus:ring-red-500' 
                    : passwordsMatch 
                    ? 'border-emerald-500/50 focus:ring-emerald-500'
                    : 'border-slate-600/50 focus:ring-blue-500'
                } rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent font-medium tracking-wide text-base xl:text-lg`}
              />
              {password2.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-red-400 font-medium">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 xl:w-6 xl:h-6 mt-1 rounded bg-slate-800 border-slate-600 cursor-pointer"
              />
              <label className="text-slate-400 text-sm xl:text-base leading-relaxed cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                I agree to the{' '}
                <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={!passwordsMatch || !agreeTerms}
              className={`w-full flex items-center justify-center space-x-3 px-8 py-5 xl:py-6 2xl:py-7 rounded-2xl font-bold text-lg xl:text-xl 2xl:text-2xl transition-all duration-300 ${
                passwordsMatch && agreeTerms
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <UserPlus className="w-6 h-6 xl:w-7 xl:h-7" />
              <span className="tracking-wide">CREATE ACCOUNT</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-base xl:text-lg">
              Already have an account?{' '}
              <button className="text-blue-400 font-bold hover:text-blue-300 transition-colors" onClick={()=>{navigate("/")}}>
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;