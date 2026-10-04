import React from 'react';
import { Heart, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A2636] text-gray-400 text-sm border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded bg-[#C8372D] flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span>Blood<span className="text-[#16B7CC]">Bridge</span></span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Connecting donors, medical partners, and volunteers for efficient, transparent, and life-saving blood donation drives.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-[#16B7CC]">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-white transition-colors">Home Page</a></li>
              <li><a href="/register-donor" className="hover:text-white transition-colors">Donor Registration</a></li>
              <li><a href="/check-status" className="hover:text-white transition-colors">Track Status</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Volunteer & Admin Login</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-[#16B7CC]">Emergency Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#16B7CC]" />
                <span>+91 80 2360 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#16B7CC]" />
                <span>support@bloodbridge.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#16B7CC]" />
                <span>MSRIT Campus, Bengaluru</span>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-[#16B7CC]">Trust & Security</h4>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Medical Drive</span>
              </div>
              <p className="text-[11px] text-gray-400">
                All donor registrations are processed under strict medical supervision and privacy guidelines.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 BloodBridge. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for fast & transparent blood donation management.</p>
        </div>
      </div>
    </footer>
  );
};
