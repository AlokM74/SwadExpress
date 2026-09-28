import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import EventCard from './EventCard';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../../State/Restaurant/Action';


const ACCENT = '#7a1f1f';
const BG = '#0e0e0e';
const BORDER = '#2a2a2a';



const FILTERS = ['All', 'Ongoing', 'Upcoming', 'Past'];

const formatEvent = (event) => {
  const start = new Date(event.eventStart);
  const end = new Date(event.eventEnd);
  const validStart = !Number.isNaN(start.getTime());
  const validEnd = !Number.isNaN(end.getTime());
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = end.getTime();
  const phase = validStart && validEnd
    ? startTime > now
      ? 'Upcoming'
      : endTime < now
        ? 'Past'
        : 'Ongoing'
    : 'Upcoming';
  const formatDateTime = (date, valid) =>
    valid
      ? date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }) + ` at ${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}`
      : 'Date unavailable';
  return {
    id: event.id,
    title: event.eventName || 'Food event',
    restaurantName: event.restaurantName || 'SwadExpress restaurant',
    date: validStart
      ? start.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Date unavailable',
    time: validStart
      ? start.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : 'Time unavailable',
    location: 'SwadExpress restaurant event',
    status: phase,
    phase,
    startDateTime: formatDateTime(start, validStart),
    endDateTime: formatDateTime(end, validEnd),
    description: event.eventDescription,
    images: event.images,
  };
};

const Events = () => {
  const [filter, setFilter] = useState('All');
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state.auth);
  const storedEvents = useSelector((state) => state.restaurant.events);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    dispatch(getEvents(jwt))
      .catch((requestError) => {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              'Unable to load events. Please try again.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dispatch, jwt]);

  const events = useMemo(
    () => (Array.isArray(storedEvents) ? storedEvents.map(formatEvent) : []),
    [storedEvents],
  );

  const filtered = events.filter((event) => {
    const matchesFilter = filter === 'All' || event.phase === filter;
    return matchesFilter;
  });

  return (
    <Box
      className="profile-scrollbar-hidden"
      sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        bgcolor: BG,
        color: '#e5e5e5',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5 },
      }}
    >
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: 20, sm: 26 },
          fontWeight: 600,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <EventOutlinedIcon sx={{ color: '#AB47BC' }} />
        <span>Events</span>
      </Typography>

      
      <Tabs
        value={filter}
        onChange={(_, val) => setFilter(val)}
        sx={{
          mb: { xs: 2.5, sm: 3.5 },
          minHeight: 36,
          borderBottom: `1px solid ${BORDER}`,
          '& .MuiTabs-indicator': { bgcolor: ACCENT, height: 2 },
        }}
      >
        {FILTERS.map((t) => (
          <Tab
            key={t}
            value={t}
            label={t}
            sx={{
              textTransform: 'none',
              fontSize: { xs: 13, sm: 14 },
              minHeight: 36,
              color: '#9ca3af',
              '&.Mui-selected': { color: '#fff' },
            }}
          />
        ))}
      </Tabs>

      
      {loading ? (
        <Typography sx={{ py: 6, textAlign: 'center', color: '#9ca3af' }}>
          Loading events...
        </Typography>
      ) : error ? (
        <Typography sx={{ py: 6, textAlign: 'center', color: '#f87171' }}>
          {error}
        </Typography>
      ) : filtered.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2, sm: 2.5 },
            alignItems: 'stretch',
          }}
        >
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px dashed ${BORDER}`,
            borderRadius: 3,
            py: { xs: 6, sm: 8 },
            textAlign: 'center',
          }}
        >
          <EventOutlinedIcon sx={{ fontSize: 40, color: '#6b7280', mb: 1.5 }} />
          <Typography sx={{ fontSize: { xs: 14, sm: 15 }, color: '#9ca3af' }}>
            No {filter.toLowerCase()} events found
          </Typography>
          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: '#6b7280', mt: 0.5 }}>
            {`Check back later for ${filter.toLowerCase()} food events`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Events;