'use client';

import { useEffect, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authstore';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

const TherapistProfilePage = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiHelpers.therapistPortal.getSettings();
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout type="therapist">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
        </div>
      </DashboardLayout>
    );
  }

  const specializations = profileData?.specializations || ['General Therapy'];
  const languages = profileData?.languages || ['English'];
  const education = profileData?.education || [];

  return (
    <DashboardLayout type="therapist">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-3xl font-bold text-white">
              {user?.firstName?.charAt(0) || 'T'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-gray-400">
                {profileData?.title || 'Licensed Therapist'} • {profileData?.experienceYears || '5+'} years experience
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-300">{profileData?.rating || '4.9'} rating</span>
                <span className="text-xs text-gray-500">• {profileData?.reviewCount || '0'} reviews</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Edit public profile
            </Button>
            <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 shadow-lg shadow-therapy-500/20">
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
              <p className="text-sm text-gray-300 leading-relaxed">
                {profileData?.bio || 'No bio provided yet. Update your profile to tell clients about your approach.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <InfoRow icon={Briefcase} label="License" value={profileData?.licenseNumber || 'Not provided'} />
                <InfoRow icon={Globe2} label="Time zone" value={profileData?.timezone || 'GMT'} />
                <InfoRow icon={User} label="Accepting new clients" value={profileData?.acceptingNewClients ? 'Yes' : 'No'} />
                <InfoRow icon={Award} label="Total sessions" value={`${profileData?.totalSessions || 0}+`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-gray-300">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec: string) => (
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
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang: string) => (
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
            {education.length > 0 ? (
              education.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-therapy-500/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.degree}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.institution}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{item.year}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic py-4 text-center">No education history added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Professional Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400 italic">
              This is what clients see when they view your profile and book a
              session. Use it to explain your approach, focus areas, and clinical philosophy.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 leading-relaxed">
              {profileData?.longBio || profileData?.bio || 'Your detailed professional bio will appear here.'}
            </div>
            <Button variant="outline" className="border-white/10 text-white mt-2">
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
  icon: any;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-white/5 text-gray-400">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
};

export default TherapistProfilePage;

