'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Star,
  Briefcase,
  Globe2,
  Languages,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/store/authstore';

const TherapistProfilePage = () => {
  const { user } = useAuthStore();

  const specializations = ['Anxiety', 'Depression', 'Trauma', 'Relationships'];
  const languages = ['English', 'Spanish'];

  const education = [
    {
      institution: 'Stanford University',
      degree: 'M.S. Clinical Psychology',
      year: '2017',
    },
    {
      institution: 'UCLA',
      degree: 'B.A. Psychology',
      year: '2013',
    },
  ];

  return (
    <DashboardLayout type="therapist">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-3xl font-bold">
              {user?.firstName?.charAt(0) || 'T'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-gray-400">
                Licensed Therapist • 5+ years experience
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-300">4.9 rating</span>
                <span className="text-xs text-gray-500">• 120 reviews</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white/10 text-white">
              Edit public profile
            </Button>
            <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
              Preview as client
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                I specialize in helping adults navigate anxiety, burnout, and major
                life transitions. My approach combines CBT, mindfulness, and
                trauma-informed care to create a safe, collaborative space for
                growth.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={Briefcase} label="License" value="LMFT 123456 • California" />
                <InfoRow icon={Globe2} label="Time zone" value="America/Los_Angeles" />
                <InfoRow icon={User} label="Accepting new clients" value="Yes" />
                <InfoRow icon={Award} label="Total sessions" value="240+" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-300">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 rounded-full bg-therapy-500/10 border border-therapy-500/30 text-therapy-200 text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-full bg-calm-500/10 border border-calm-500/30 text-calm-200 text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <GraduationCap className="w-5 h-5 text-therapy-400" />
              <span>Education and credentials</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {education.map((item) => (
              <div
                key={item.institution}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.degree}</p>
                  <p className="text-xs text-gray-400">{item.institution}</p>
                </div>
                <span className="text-xs text-gray-400">{item.year}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Bio shown to clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              This is what clients see when they view your profile and book a
              session. Use it to explain your approach, what clients can expect, and
              who you work best with.
            </p>
            <Button variant="outline" className="border-white/10 text-white">
              Edit bio
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-white/5 text-gray-300">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
};

export default TherapistProfilePage;

