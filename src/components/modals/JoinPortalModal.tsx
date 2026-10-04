import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, LogIn, UserPlus, AlertCircle, User, Mail, Hash, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinPortalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, users, registerUser, loginUser, logoutUser } = useApp();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [department, setDepartment] = useState<string>('Electronics & Computer Science');
  const [year, setYear] = useState<string>('3rd Year Undergraduate');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = registerUser({
      name,
      email,
      studentId,
      department,
      year
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to initialize portal access.');
    }
  };

  const handleQuickLogin = (existingUser: any) => {
    loginUser(existingUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                GUILD IDENTITY GATEWAY
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Cadet Operations Portal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already logged in */}
        {currentUser ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#161822] border border-[#3fdeb7]/30">
              <div className="text-[10px] font-mono-code uppercase text-[#3fdeb7] mb-1">
                Authenticated Cadet Session
              </div>
              <div className="font-headline text-lg font-bold text-white">{currentUser.name}</div>
              <div className="font-mono-code text-xs text-[#00eefc] mt-0.5">
                ID: {currentUser.studentId} • {currentUser.department}
              </div>
              <div className="text-xs text-[#9ba0b4] mt-1 font-mono-code">
                {currentUser.email} • {currentUser.year}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2b2c37]">
              <button
                type="button"
                onClick={logoutUser}
                className="px-4 py-2 rounded-lg bg-[#ff5545]/20 hover:bg-[#ff5545]/30 text-[#ff5545] border border-[#ff5545]/40 font-mono-code text-xs font-semibold transition-colors"
              >
                Sign Out Session
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-white font-headline text-xs uppercase font-bold transition-colors"
              >
                Return to Lab Console
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab switch between New Cadet and Quick Existing */}
            <div className="mt-5 grid grid-cols-2 p-1 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`py-2 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
                  isRegisterMode
                    ? 'bg-[#ff5545] text-white shadow-md'
                    : 'text-[#9ba0b4] hover:text-white'
                }`}
              >
                New Registration
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`py-2 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
                  !isRegisterMode
                    ? 'bg-[#00eefc] text-[#0d0e15] shadow-md font-bold'
                    : 'text-[#9ba0b4] hover:text-white'
                }`}
              >
                Demo Cadets ({users.length})
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5545] mt-0.5" />
                <div>
                  <span className="font-bold">Portal Error:</span> {errorMsg}
                </div>
              </div>
            )}

            {isRegisterMode ? (
              <form onSubmit={handleRegister} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                    Cadet Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                      required
                    />
                    <User className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="cadet@university.edu"
                        className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                        required
                      />
                      <Mail className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                      Student ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. ECS-2024-880"
                        className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                        required
                      />
                      <Hash className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                    >
                      <option value="Electronics & Computer Science">
                        Electronics & Computer Science
                      </option>
                      <option value="Autonomous Systems & Robotics">
                        Autonomous Systems & Robotics
                      </option>
                      <option value="Embedded Systems Engineering">
                        Embedded Systems Engineering
                      </option>
                      <option value="Artificial Intelligence & ML">
                        Artificial Intelligence & ML
                      </option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                      Class / Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                    >
                      <option value="1st Year Cadet">1st Year Cadet</option>
                      <option value="2nd Year Junior">2nd Year Junior</option>
                      <option value="3rd Year Senior">3rd Year Senior</option>
                      <option value="Final Year Lead">Final Year Lead</option>
                      <option value="Graduate Researcher">Graduate Researcher</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2b2c37]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,85,69,0.35)] hover:shadow-[0_0_28px_rgba(255,85,69,0.55)] transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Initialize Portal Access</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 space-y-2.5">
                <p className="text-xs text-[#9ba0b4]">
                  Select a pre-registered cadet profile to simulate authenticated lab interactions:
                </p>
                {users.map((usr) => (
                  <div
                    key={usr.id}
                    onClick={() => handleQuickLogin(usr)}
                    className="p-3.5 rounded-xl bg-[#0d0e15] hover:bg-[#1b1c25] border border-[#2b2c37] hover:border-[#00eefc]/50 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="font-headline text-sm font-bold text-white group-hover:text-[#00eefc] transition-colors">
                        {usr.name}
                      </div>
                      <div className="font-mono-code text-[11px] text-[#9ba0b4]">
                        {usr.studentId} • {usr.department}
                      </div>
                    </div>
                    <span className="font-mono-code text-xs text-[#00eefc] px-2.5 py-1 rounded bg-[#00eefc]/10 border border-[#00eefc]/30">
                      Sign In →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
