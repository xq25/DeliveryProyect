import { Chart } from 'chart.js/auto';

// Theme
export const mode = 'light';

export const fonts = {
  base: 'Open Sans'
};

// Colors
export const colors = {
  gray: {
    100: '#f6f9fc',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#8898aa',
    700: '#525f7f',
    800: '#32325d',
    900: '#212529'
  },
  theme: {
    default: '#172b4d',
    primary: '#5e72e4',
    secondary: '#f4f5f7',
    info: '#11cdef',
    success: '#2dce89',
    danger: '#f5365c',
    warning: '#fb6340'
  },
  black: '#12263F',
  white: '#FFFFFF',
  transparent: 'transparent'
};

/**
 * OPCIONES GLOBALES DEL CHART
 */
export function chartOptions() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
      }
    },

    elements: {
      point: {
        radius: 0,
        backgroundColor: colors.theme.primary
      },
      line: {
        tension: 0.4,
        borderWidth: 4,
        borderColor: colors.theme.primary,
        backgroundColor: colors.transparent
      },
      bar: {
        backgroundColor: colors.theme.warning,
        borderRadius: 6,
        maxBarThickness: 10
      }
    },

    scales: {
      y: {
        grid: {
          borderDash: [2],
          color: mode === 'light' ?colors.gray[300]  : colors.gray[900],
          drawBorder: false
        },
        ticks: {
          padding: 10,
          callback: (value: any) => {
            if (value % 10 === 0) return value;
            return '';
          }
        }
      },

      x: {
        grid: {
          display: false
        },
        ticks: {
          padding: 20
        }
      }
    }
  };

  return options;
}


// Función para combinar opciones
export const parseOptions = (parent: any, options: any) => {
  for (const item in options) {
    if (typeof options[item] !== 'object') {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}

// =============================
// EJEMPLO 1 – LINE CHART
// =============================
export const chartExample1 = {
  type: 'line' as const,

  data: {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Performance',
        data: [0, 20, 10, 30, 15, 40, 20, 60],
        borderColor: colors.theme.primary,
        backgroundColor: 'rgba(94,114,228,0.1)',
        fill: true
      }
    ]
  },

  options: chartOptions()
}


// =============================
// EJEMPLO 2 – BAR CHART
// =============================
export const chartExample2 = {
  type: 'bar' as const,

  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29],
        backgroundColor: colors.theme.warning,
        borderRadius: 6,
        maxBarThickness: 12
      }
    ]
  },

  options: chartOptions()
}
