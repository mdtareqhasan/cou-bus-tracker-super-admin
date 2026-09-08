import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Group as GroupIcon,
  Cloud as CloudIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Campaign as CampaignIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

import api from '../api/axios.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

const GRADIENTS = [
  'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
  'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
];

const StatCard = ({ icon, label, value, sub, gradientIndex = 0, action }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value && typeof value === 'string') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: GRADIENTS[gradientIndex % GRADIENTS.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 4px 14px rgba(0,0,0,0.1)`,
            }}
          >
            {icon}
          </Box>
          {action && (
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: '#94A3B8', mt: -0.5, mr: -0.5 }}>
                {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500, mb: 0.5, fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.3,
            wordBreak: 'break-all',
            fontSize: value && String(value).length > 20 ? '0.85rem' : '1.25rem',
          }}
        >
          {value || '—'}
        </Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [admins, config] = await Promise.all([
          api.get('/super-admin/manage'),
          api.get('/super-admin/config'),
        ]);
        if (!mounted) return;
        const configMap = {};
        config.data.forEach((c) => { configMap[c.configKey] = c.configValue; });
        setData({
          totalSuperAdmins: admins.data.length,
          activeSuperAdmins: admins.data.filter((a) => a.isActive).length,
          config: configMap,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingScreen message="Loading dashboard..." />;
  if (!data) return <Typography>Failed to load dashboard.</Typography>;

  const cfg = data.config;

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<GroupIcon />}
            label="Total Super Admins"
            value={data.totalSuperAdmins}
            sub={`${data.activeSuperAdmins} active`}
            gradientIndex={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<PhoneAndroidIcon />}
            label="Latest App Version"
            value={cfg.latest_app_version || '—'}
            sub={`Min: ${cfg.minimum_app_version || '—'}`}
            gradientIndex={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<CampaignIcon />}
            label="Maintenance Mode"
            value={cfg.maintenance_mode === 'true' ? 'ACTIVE' : 'INACTIVE'}
            sub={cfg.maintenance_mode === 'true' ? 'App is locked' : 'Operating normally'}
            gradientIndex={3}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<SpeedIcon />}
            label="Force Update"
            value={cfg.force_update === 'true' ? 'ENABLED' : 'DISABLED'}
            sub={cfg.force_update === 'true' ? 'Users must update' : 'Optional updates'}
            gradientIndex={1}
          />
        </Grid>

        {/* Server Configuration Card */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'rgba(79, 70, 229, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F46E5',
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Server Configuration
                </Typography>
              </Box>
              <Stack spacing={0}>
                <ConfigRow
                  label="API Base URL"
                  value={cfg.api_base_url}
                  highlight
                />
                <ConfigRow
                  label="Admin Panel URL"
                  value={cfg.admin_panel_url}
                />
                <ConfigRow
                  label="Super Admin Panel URL"
                  value={cfg.super_admin_panel_url}
                />
                <ConfigRow
                  label="Play Store URL"
                  value={cfg.play_store_url}
                  isLast
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* App Version Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                  }}
                >
                  <PhoneAndroidIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  App Version Status
                </Typography>
              </Box>
              <Stack spacing={0}>
                <ConfigRow
                  label="Latest Version"
                  value={cfg.latest_app_version}
                  chip
                  chipColor="primary"
                />
                <ConfigRow
                  label="Minimum Version"
                  value={cfg.minimum_app_version}
                  chip
                  chipColor="info"
                />
                <ConfigRow
                  label="Force Update"
                  value={cfg.force_update === 'true' ? 'Yes' : 'No'}
                  chip
                  chipColor={cfg.force_update === 'true' ? 'error' : 'success'}
                />
                <ConfigRow
                  label="Maintenance Mode"
                  value={cfg.maintenance_mode === 'true' ? 'ON' : 'OFF'}
                  chip
                  chipColor={cfg.maintenance_mode === 'true' ? 'warning' : 'success'}
                  isLast
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function ConfigRow({ label, value, chip, chipColor, highlight, isLast }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)',
        gap: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.8rem', minWidth: 120 }}>
        {label}
      </Typography>
      {chip ? (
        <Chip
          label={value || '—'}
          size="small"
          color={chipColor}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.7rem', height: 26 }}
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: '0.75rem',
              color: highlight ? '#4F46E5' : '#334155',
              fontWeight: highlight ? 600 : 400,
              wordBreak: 'break-all',
              textAlign: 'right',
            }}
          >
            {value || '—'}
          </Typography>
          {value && (
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: '#94A3B8', flexShrink: 0 }}>
                {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <CopyIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}
