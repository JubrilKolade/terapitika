'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Plus, Clock, Video, MessageSquare, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { apiHelpers } from '@/lib/api';
import { Booking, BookingStatus, SessionType, Therapist } from '@/types';

type UIBooking = {
  id: string;
  therapist: string;
  type: string;
  date: string;
  time: string;
  status: string;
  image: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<UIBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiHelpers.bookings.getMine();
        const payload = (response as any)?.data;
        const raw = payload?.data ?? payload?.items ?? payload;
        const data: any[] = Array.isArray(raw) ? raw : [];

        if (!isMounted) return;

        const mapped: UIBooking[] = data.map((b) => {
          const booking = b as Booking;
          const therapist: Therapist | undefined =
            (b as any).therapist ||
            (b as any).session?.therapist ||
            (b as any).session?.booking?.therapist;

          const therapistName =
            therapist?.firstName && therapist?.lastName
              ? `${therapist.firstName} ${therapist.lastName}`
              : therapist?.firstName || therapist?.lastName || 'Assigned Therapist';

          const start = booking.startTime ? new Date(booking.startTime) : null;
          const dateLabel = start
            ? start.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })
            : '';
          const timeLabel = start
            ? start.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })
            : '';

          const typeLabel = (() => {
            switch (booking.type) {
              case SessionType.HUMAN_VIDEO:
                return 'Video Session';
              case SessionType.HUMAN_CHAT:
              case SessionType.AI_CHAT:
                return 'Chat Session';
              case SessionType.HUMAN_VOICE:
              case SessionType.AI_VOICE:
                return 'Voice Call';
              default:
                return 'Session';
            }
          })();

          const statusLabel = (() => {
            switch (booking.status) {
              case BookingStatus.CONFIRMED:
              case BookingStatus.RESCHEDULED:
              case BookingStatus.PENDING:
                return 'Upcoming';
              case BookingStatus.CANCELLED:
                return 'Cancelled';
              default:
                return 'Pending';
            }
          })();

          const image =
            therapistName && therapistName.trim().length > 0
              ? therapistName.trim().charAt(0).toUpperCase()
              : 'T';

          return {
            id: booking.id,
            therapist: therapistName,
            type: typeLabel,
            date: dateLabel,
            time: timeLabel,
            status: statusLabel,
            image,
          };
        });

        setBookings(mapped);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.response?.data?.message || 'Failed to load bookings');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">My Bookings</h1>
            <p className="text-gray-400">Manage and schedule your therapy sessions</p>
          </div>
          <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 shadow-lg shadow-therapy-500/50">
            <Plus className="mr-2 h-4 w-4" />
            Book New Session
          </Button>
        </div>

        <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
          <Button variant="ghost" className="text-white bg-white/5">
            Upcoming
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Past
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Cancelled
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="border-white/10 text-white">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {isLoading && bookings.length === 0 && (
            <div className="text-sm text-gray-400">Loading your bookings...</div>
          )}
          {!isLoading && bookings.length === 0 && !error && (
            <div className="text-sm text-gray-400">You have no bookings yet.</div>
          )}
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-therapy-500/50 transition-all group overflow-hidden border-none cursor-pointer"
            >
              <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-xl font-bold">
                    {booking.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-therapy-400 transition-colors">
                      {booking.therapist}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      {booking.type === 'Video Session' && <Video size={14} className="mr-2" />}
                      {booking.type === 'Chat Session' && <MessageSquare size={14} className="mr-2" />}
                      {booking.type === 'Voice Call' && <Phone size={14} className="mr-2" />}
                      {booking.type}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-8 md:gap-2 lg:gap-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Date</span>
                    <span className="text-white">{booking.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Time</span>
                    <span className="text-white">{booking.time}</span>
                  </div>
                  <div className="flex flex-col min-w-[100px]">
                    <span className="text-xs text-gray-400 uppercase font-bold">Status</span>
                    <span className={booking.status === 'Upcoming' ? 'text-green-400' : 'text-yellow-400'}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="border-white/10 text-white flex-1 md:flex-none">
                    Reschedule
                  </Button>
                  <Button className="bg-therapy-500 hover:bg-therapy-600 flex-1 md:flex-none">
                    Join Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
