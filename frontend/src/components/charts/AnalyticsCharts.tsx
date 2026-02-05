"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DailyStats {
  date: string
  pageViews: number
  uniqueVisitors: number
}

interface ChartData {
  labels: string[]
  datasets: any[]
}

// Line Chart for Daily Traffic
export function TrafficChart({ dailyStats }: { dailyStats: DailyStats[] }) {
  const data: ChartData = {
    labels: dailyStats.map(stat => {
      const date = new Date(stat.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Page Views',
        data: dailyStats.map(stat => stat.pageViews),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Unique Visitors',
        data: dailyStats.map(stat => stat.uniqueVisitors),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            weight: 'bold' as const,
            size: 12,
          },
          color: '#000',
        },
      },
      title: {
        display: true,
        text: '📈 Daily Traffic Trends',
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      x: {
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
    },
  }

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  )
}

// Bar Chart for Top Pages
export function TopPagesChart({ topPages }: { topPages: Array<{ url: string; title: string; views: number }> }) {
  const data: ChartData = {
    labels: topPages.map(page => page.title || page.url).slice(0, 5),
    datasets: [
      {
        label: 'Page Views',
        data: topPages.map(page => page.views).slice(0, 5),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '📄 Top Pages by Views',
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
          maxRotation: 45,
        },
      },
    },
  }

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  )
}

// Doughnut Chart for Device Stats
export function DeviceChart({ deviceStats }: { deviceStats: Array<{ device: string; users: number }> }) {
  const data: ChartData = {
    labels: deviceStats.map(device => device.device.charAt(0).toUpperCase() + device.device.slice(1)),
    datasets: [
      {
        data: deviceStats.map(device => device.users),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            weight: 'bold' as const,
            size: 12,
          },
          color: '#000',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: '📱 Device Distribution',
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        color: '#000',
      },
    },
  }

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
    </div>
  )
}

// Doughnut Chart for Browser Stats
export function BrowserChart({ browserStats }: { browserStats: Array<{ browser: string; users: number }> }) {
  const data: ChartData = {
    labels: browserStats.map(browser => browser.browser),
    datasets: [
      {
        data: browserStats.map(browser => browser.users),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(147, 51, 234)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            weight: 'bold' as const,
            size: 12,
          },
          color: '#000',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: '🌐 Browser Distribution',
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        color: '#000',
      },
    },
  }

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
    </div>
  )
}

// Bar Chart for Country Stats
export function CountryChart({ topCountries }: { topCountries: Array<{ country: string; visitors: number }> }) {
  const data: ChartData = {
    labels: topCountries.map(country => country.country).slice(0, 8),
    datasets: [
      {
        label: 'Visitors',
        data: topCountries.map(country => country.visitors).slice(0, 8),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '🌍 Top Countries by Visitors',
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        color: '#000',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
    },
  }

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  )
}