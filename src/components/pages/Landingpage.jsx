import { Bar, Line } from 'react-chartjs-2';
import { FiActivity, FiAlertCircle, FiArrowUp, FiBarChart2, FiGlobe, FiZap } from 'react-icons/fi';
import { useEffect, useState } from 'react';

import API_URL from 'src/config/apiconfig';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { useSelector } from 'react-redux';

// import { getYesterdayDate } from 'src/components/industry-components/IndustryEnergy';

function formatNumber(value) {
  // Use Intl.NumberFormat for locale-aware formatting
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // Use 'currency' if you want to format as currency
    minimumFractionDigits: 2, // Minimum 2 decimal places
    maximumFractionDigits: 2, // Maximum 2 decimal places
  });

  return formatter.format(value);
}

export const getPreviosToYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 2);
  return previousYesterday;
};

export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const getPreviousToYesterdayDate = () => {
  const previousToYesterday = new Date();
  previousToYesterday.setDate(previousToYesterday.getDate() - 2);
  return previousToYesterday;
};
const EnergyTracker = () => {
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [energyData, setEnergyData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [totalEnergyGeneratedHourly, setTotalEnergyGeneratedHourly] = useState(0);
  const [previousDayEnergy, setPreviousDayEnergy] = useState(0);
  const [trendPercentage, setTrendPercentage] = useState(0);
  const [trendDirection, setTrendDirection] = useState('up');

  console.log(previousDayEnergy, 'dhdh');
  useEffect(() => {
    const fetchData = async () => {
      const mockData = {
        currentUsage: 4500,
        comparison: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          Nigeria: [5000, 5200, 4800, 4500, 4600, 4700],
          Germany: [4000, 4100, 3900, 3800, 3700, 3600],
        },
        alerts: ['High demand in Lagos', 'Solar potential high in Kano'],
      };
      setEnergyData(mockData);
    };
    fetchData();
  }, []);

  const fetchEnergyData = async (date) => {
    try {
      const response = await axios.get(`${API_URL}/Hourly-Energy-Generated`, {
        params: {
          startDate: date.toISOString().split('T')[0],
          endDate: date.toISOString().split('T')[0],
        },
      });

      const totalEnergy = response.data.data.reduce((total, entry) => {
        const energyValue = parseFloat(entry.EnergyGeneratedMWh) || 0;
        return total + energyValue;
      }, 0);

      return totalEnergy;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const calculateTrend = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  useEffect(() => {
    const fetchBothDays = async () => {
      const yesterday = getYesterdayDate();
      const previousToYesterday = getPreviousToYesterdayDate();

      const yesterdayEnergy = await fetchEnergyData(yesterday);
      const previousDayEnergyValue = await fetchEnergyData(previousToYesterday);

      setTotalEnergyGeneratedHourly(yesterdayEnergy);
      setPreviousDayEnergy(previousDayEnergyValue);

      const trend = calculateTrend(yesterdayEnergy, previousDayEnergyValue);
      setTrendPercentage(Math.abs(trend));
      setTrendDirection(trend >= 0 ? 'up' : 'down');
    };

    fetchBothDays();
  }, []);
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-wrapper">
            <FiZap className="logo-icon" />
            <span className="logo-text">Elec-t</span>
          </div>
          <div className="nav-links">
            <a href="#dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="#compare" className="nav-link">
              Compare
            </a>
            <a href="#alerts" className="nav-link">
              Alerts
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-heading">
              Track Energy Usage Across <span className="highlight">Nigeria</span> & Beyond
            </h1>
            <p className="hero-description">
              Real-time energy monitoring, comparative analytics, and smart recommendations for
              efficient power usage.
            </p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search country..."
                className="country-input"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              />
              <button className="analyze-button">Analyze</button>
            </div>
          </div>
          <div className="illustration-wrapper">
            <img
              src="/energy-illustration.svg"
              alt="Energy Tracking"
              className="energy-illustration"
            />
          </div>
        </div>
      </div>

      {/* Live Stats */}
      {energyData && (
        <div className="stats-grid">
          {/* Yesterday's Energy Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <FiActivity className="stat-icon" />
              </div>
              <h3 className="stat-title">Yesterday's Energy Generated</h3>
            </div>
            <div className="stat-value">{formatNumber(totalEnergyGeneratedHourly)} MW</div>
            <div className="stat-trend">
              {trendDirection === 'up' ? (
                <FiArrowUp className="trend-icon up" />
              ) : (
                <FiArrowDown className="trend-icon down" />
              )}
              <span>{formatNumber(trendPercentage)}% from previous day</span>
            </div>
          </div>

          {/* Previous Day's Energy Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <FiActivity className="stat-icon" />
              </div>
              <h3 className="stat-title">Previous Day's Energy Generated</h3>
            </div>
            <div className="stat-value">{formatNumber(previousDayEnergy)} MW</div>
            <div className="stat-comparison">
              <span className="comparison-label">Reference value for comparison</span>
            </div>
          </div>

          {/* Daily Change Summary Card */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                {trendDirection === 'up' ? (
                  <FiArrowUp className="stat-icon success" />
                ) : (
                  <FiArrowDown className="stat-icon danger" />
                )}
              </div>
              <h3 className="stat-title">Daily Change Summary</h3>
            </div>
            <div className="stat-value">
              {formatNumber(Math.abs(totalEnergyGeneratedHourly - previousDayEnergy))} MW
            </div>
            <div className="stat-description">
              <span className={`change-indicator ${trendDirection}`}>
                {trendDirection === 'up' ? 'Increase' : 'Decrease'} from previous day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="chart-section">
        <h2 className="section-heading">
          <FiBarChart2 className="section-icon" />
          Country Comparison
        </h2>
        <div className="chart-container">
          <Bar
            data={{
              labels: energyData?.comparison.labels,
              datasets: [
                {
                  label: 'Nigeria',
                  data: energyData?.comparison.Nigeria,
                  backgroundColor: '#10B981',
                },
                {
                  label: 'Germany',
                  data: energyData?.comparison.Germany,
                  backgroundColor: '#3B82F6',
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-heading centered">Why Choose PowerTrack?</h2>
        <div className="features-grid">
          {[
            {
              icon: FiGlobe,
              title: 'Global Coverage',
              text: 'Track energy usage across multiple countries',
            },
            {
              icon: FiAlertCircle,
              title: 'Real-time Alerts',
              text: 'Get instant notifications for anomalies',
            },
            {
              icon: FiZap,
              title: 'Smart Analysis',
              text: 'AI-powered recommendations for efficiency',
            },
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyTracker;
