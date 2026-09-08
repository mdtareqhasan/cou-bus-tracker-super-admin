import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import {
  Group as GroupIcon,
  Cloud as CloudIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';

import api from '../api/axios.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

const StatCard = ({ icon, label, value, sub }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #20146B 0%, #1D64C2 100%)',
            color: 'white',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<GroupIcon />}
            label="Total Super Admins"
            value={data.totalSuperAdmins}
            sub={`${data.activeSuperAdmins} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CloudIcon />}
            label="API Base URL"
            value={cfg.api_base_url || '—'}
            sub="Flutter app target"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PhoneAndroidIcon />}
            label="Latest App Version"
            value={cfg.latest_app_version || '—'}
            sub={`Min: ${cfg.minimum_app_version || '—'}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CampaignIcon />}
            label="Maintenance Mode"
            value={cfg.maintenance_mode === 'true' ? 'ON' : 'OFF'}
            sub={cfg.maintenance_mode === 'true' ? 'Flutter app locked' : 'Operating normally'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Current Server Configuration
              </Typography>
              <Stack spacing={1.5}>
                <ConfigRow label="API Base URL" value={cfg.api_base_url} />
                <ConfigRow label="Admin Panel URL" value={cfg.admin_panel_url} />
                <ConfigRow label="Super Admin Panel URL" value={cfg.super_admin_panel_url} />
                <ConfigRow label="Play Store URL" value={cfg.play_store_url} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                App Version & Update Status
              </Typography>
              <Stack spacing={1.5}>
                <ConfigRow label="Latest Version" value={cfg.latest_app_version} />
                <ConfigRow label="Minimum Version" value={cfg.minimum_app_version} />
                <ConfigRow
                  label="Force Update"
                  value={cfg.force_update}
                  chipColor={cfg.force_update === 'true' ? 'error' : 'success'}
                />
                <ConfigRow
                  label="Maintenance Mode"
                  value={cfg.maintenance_mode}
                  chipColor={cfg.maintenance_mode === 'true' ? 'warning' : 'success'}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function ConfigRow({ label, value, chipColor }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {chipColor ? (
        <Chip
          label={value || '—'}
          size="small"
          color={chipColor}
          variant={chipColor === 'success' ? 'outlined' : 'filled'}
        />
      ) : (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'right' }}>
          {value || '—'}
        </Typography>
      )}
    </Box>
  );
}