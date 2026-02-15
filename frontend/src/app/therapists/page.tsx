'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Video,
  MessageSquare,
  Clock,
  DollarSign,
  Award,
  Languages,
  ChevronRight,
  Heart,
  Grid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function TherapistsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [] as string[],
    availability: [] as string[],
    priceRange: [] as string[],
    language: [] as string[],
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="fixed top-20 left-20 w-96 h-96 bg-therapy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-calm-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-[#0A0A0F]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Find Your <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">Perfect Therapist</span>
                </h1>
                <p className="text-gray-400">Browse {therapists.length}+ licensed professionals</p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-3">
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, specialization..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500 focus:border-transparent backdrop-blur-xl"
                  />
                </div>
                <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex items-center space-x-3 mt-4 overflow-x-auto scrollbar-hide">
              {filterTags.map((tag, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all text-sm whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-400">{therapists.length} therapists available</p>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-therapy-500/20 text-therapy-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-therapy-500/20 text-therapy-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {therapists.map((therapist, i) => (
              <motion.div
                key={therapist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-therapy-500/50 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold text-xl">
                        {therapist.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-therapy-400 transition-colors">
                          {therapist.name}
                        </h3>
                        <p className="text-sm text-gray-400">{therapist.title}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>

                  {/* Rating & Experience */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{therapist.rating}</span>
                      <span className="text-sm text-gray-400">({therapist.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{therapist.experience}+ years</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.specializations.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-therapy-500/20 text-therapy-400"
                      >
                        {spec}
                      </span>
                    ))}
                    {therapist.specializations.length > 3 && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-400">
                        +{therapist.specializations.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Languages className="w-4 h-4" />
                      <span>{therapist.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{therapist.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>${therapist.rate}/session</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Available {therapist.nextAvailable}</span>
                  </div>

                  {/* Session Types */}
                  <div className="flex items-center space-x-2 mb-6">
                    {therapist.sessionTypes.includes('video') && (
                      <div className="p-2 rounded-lg bg-therapy-500/20">
                        <Video className="w-4 h-4 text-therapy-400" />
                      </div>
                    )}
                    {therapist.sessionTypes.includes('chat') && (
                      <div className="p-2 rounded-lg bg-calm-500/20">
                        <MessageSquare className="w-4 h-4 text-calm-400" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Link href={`/therapists/${therapist.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-white/10 hover:bg-white/10">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/booking?therapist=${therapist.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/10">
              Load More Therapists
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

const filterTags = [
  'Anxiety',
  'Depression',
  'Relationships',
  'Trauma',
  'LGBTQ+',
  'Available Today',
  'Under $100',
];

const therapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Clinical Psychologist',
    rating: 4.9,
    reviews: 127,
    experience: 12,
    specializations: ['Anxiety', 'Depression', 'Trauma', 'PTSD'],
    languages: ['English', 'Spanish'],
    location: 'New York, NY',
    rate: 150,
    nextAvailable: 'today',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Licensed Therapist',
    rating: 4.8,
    reviews: 98,
    experience: 8,
    specializations: ['Relationships', 'Family Therapy', 'Communication'],
    languages: ['English', 'Mandarin'],
    location: 'San Francisco, CA',
    rate: 120,
    nextAvailable: 'tomorrow',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    title: 'Psychiatric Nurse',
    rating: 5.0,
    reviews: 156,
    experience: 15,
    specializations: ['Bipolar', 'ADHD', 'Medication Management'],
    languages: ['English'],
    location: 'Los Angeles, CA',
    rate: 180,
    nextAvailable: 'this week',
    sessionTypes: ['video'],
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    title: 'Marriage Counselor',
    rating: 4.7,
    reviews: 89,
    experience: 10,
    specializations: ['Marriage', 'Couples Therapy', 'Conflict Resolution'],
    languages: ['English', 'French'],
    location: 'Miami, FL',
    rate: 140,
    nextAvailable: 'today',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '5',
    name: 'Dr. Lisa Park',
    title: 'Child Psychologist',
    rating: 4.9,
    reviews: 143,
    experience: 11,
    specializations: ['Child Therapy', 'Adolescent Issues', 'Behavioral'],
    languages: ['English', 'Korean'],
    location: 'Seattle, WA',
    rate: 130,
    nextAvailable: 'tomorrow',
    sessionTypes: ['video', 'chat'],
  },
  {
    id: '6',
    name: 'Dr. David Kumar',
    title: 'Addiction Specialist',
    rating: 4.8,
    reviews: 112,
    experience: 14,
    specializations: ['Addiction', 'Substance Abuse', 'Recovery'],
    languages: ['English', 'Hindi'],
    location: 'Chicago, IL',
    rate: 160,
    nextAvailable: 'today',
    sessionTypes: ['video', 'chat'],
  },
];