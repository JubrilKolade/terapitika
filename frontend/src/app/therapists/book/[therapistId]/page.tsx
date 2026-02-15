'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Mic,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'video' | 'voice' | 'chat'>('video');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('1');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="fixed top-20 left-20 w-96 h-96 bg-therapy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-calm-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Book a Session"
            subtitle="Schedule your therapy appointment"
            icon={Calendar}
            gradient
          />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Session Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Type Selection */}
              <GlassCard gradient>
                <h3 className="text-lg font-bold mb-4">Session Type</h3>
                <div className="grid grid-cols-3 gap-4">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSessionType(type.id as any)}
                      className={`p-4 rounded-xl border transition-all ${
                        sessionType === type.id
                          ? 'border-therapy-500 bg-therapy-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                        sessionType === type.id ? 'text-therapy-400' : 'text-gray-400'
                      }`} />
                      <p className="text-sm font-semibold">{type.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{type.duration}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Therapist Selection */}
              <GlassCard gradient>
                <h3 className="text-lg font-bold mb-4">Select Therapist</h3>
                <div className="space-y-3">
                  {therapists.map((therapist) => (
                    <button
                      key={therapist.id}
                      onClick={() => setSelectedTherapist(therapist.id)}
                      className={`w-full p-4 rounded-xl border transition-all flex items-center space-x-4 ${
                        selectedTherapist === therapist.id
                          ? 'border-therapy-500 bg-therapy-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {therapist.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{therapist.name}</p>
                        <p className="text-sm text-gray-400">{therapist.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${therapist.rate}</p>
                        <p className="text-xs text-gray-400">per session</p>
                      </div>
                      {selectedTherapist === therapist.id && (
                        <div className="w-6 h-6 rounded-full bg-therapy-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Calendar */}
              <GlassCard gradient>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Select Date</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // Adjust for calendar start
                    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        disabled={day < 1}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                          day < 1
                            ? 'opacity-0 pointer-events-none'
                            : isSelected
                            ? 'bg-therapy-500 text-white'
                            : isToday
                            ? 'border-2 border-therapy-500 text-therapy-400'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        {day > 0 && day}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Time Slots */}
              <GlassCard gradient>
                <h3 className="text-lg font-bold mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                        selectedTime === time
                          ? 'bg-therapy-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Booking Summary */}
            <div>
              <GlassCard gradient className="sticky top-8">
                <h3 className="text-lg font-bold mb-6">Booking Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Session Type</span>
                    <span className="font-semibold capitalize">{sessionType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Therapist</span>
                    <span className="font-semibold">
                      {therapists.find((t) => t.id === selectedTherapist)?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Time</span>
                    <span className="font-semibold">{selectedTime || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-semibold">50 minutes</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-therapy-400">
                      ${therapists.find((t) => t.id === selectedTherapist)?.rate}
                    </span>
                  </div>
                </div>

                <Button
                  disabled={!selectedTime}
                  className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </Button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  You can cancel or reschedule up to 24 hours before your session
                </p>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const sessionTypes = [
  { id: 'video', label: 'Video Call', icon: Video, duration: '50 min' },
  { id: 'voice', label: 'Voice Call', icon: Mic, duration: '50 min' },
  { id: 'chat', label: 'Text Chat', icon: MessageSquare, duration: '50 min' },
];

const therapists = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Anxiety & Depression', rate: 150 },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Relationships', rate: 120 },
  { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Trauma & PTSD', rate: 180 },
];

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];