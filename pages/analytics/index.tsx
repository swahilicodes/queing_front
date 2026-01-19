import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from './analytics.module.scss';

const AnalyticsDashboard = () => {
  const [duration, setDuration] = useState('month');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    start_date: "",
    end_date: "",
    status: "all"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5005/new_analytics/token_stats', {
          params: { duration,start_date: fields.start_date,end_date: fields.end_date,status:fields.status }
        });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [duration,fields.start_date,fields.end_date,fields.status]);

  return (
    <div className={styles.dashboardContainer}>
      <Head>
        <title>Token Analytics Dashboard</title>
        <meta name="description" content="Clinic token statistics dashboard" />
      </Head>
      <div className={styles.top_bar}>
        <h1>TICKET ANALYTICS</h1>
      </div>
      <main className={styles.mainContent}>
        
        {/* Duration Selector */}
        <div className={styles.durationSelectorContainer}>
          <div className={styles.durationSelector}>
            {['day', 'week', 'month', 'year', 'all','custom'].map((option) => (
              <button
                key={option}
                onClick={() => setDuration(option)}
                className={`${styles.durationButton} ${
                  duration === option ? styles.activeDuration : ''
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
            {
              duration==="custom" && (
                <div className={styles.customs}>
                  <div className={styles.custom}>
                  <label htmlFor="date" className="block font-medium mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={fields.start_date}
                    onChange={(e) => setFields({...fields,start_date:e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                  <div className={styles.custom}>
                  <label htmlFor="date" className="block font-medium mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={fields.end_date}
                    onChange={(e) => setFields({...fields,end_date:e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                </div>
              )
            }
            <div className={styles.status} style={{display:"none"}}>
              <select
              value={fields.status}
              onChange={e => setFields({...fields,status: e.target.value})}
              >
                <option value="all">All</option>
                <option value="waiting">On Queue</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {error && (
          <div className={styles.errorAlert} role="alert">
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className={styles.dashboardGrid}>
            {/* Summary Cards */}
            <div className={`${styles.card} ${styles.summaryCard}`}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Summary for {data.duration}</h2>
                <div className={styles.summaryGrid}>
                  <SummaryCard 
                    title="Total Tickets" 
                    value={data.total_tickets} 
                    icon="📊"
                    color="indigo"
                  />
                  <SummaryCard 
                    title="Medical Tickets" 
                    value={data.medical_tickets} 
                    icon="🏥"
                    color="green"
                  />
                  <SummaryCard 
                    title="Account Tickets" 
                    value={data.account_tickets} 
                    icon="💳"
                    color="blue"
                  />
                  <SummaryCard 
                    title="Clinic Tickets" 
                    value={data.clinic_tickets} 
                    icon="🏛️"
                    color="purple"
                  />
                </div>
              </div>
            </div>

            {/* Peak Times */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Peak Times</h2>
                {data.peak_times.length > 0 ? (
                  <ul className={styles.peakTimesList}>
                    {data.peak_times.map((time: string, index: number) => (
                      <li key={index} className={styles.peakTimeItem}>
                        <span className={styles.peakTimeNumber}>{index + 1}</span>
                        <span className={styles.peakTimeValue}>{time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noDataText}>No peak times recorded</p>
                )}
              </div>
            </div>

            {/* Output Times */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Average Processing Times</h2>
                <div className={styles.timeCardsContainer}>
                  <TimeCard 
                    title="Medical" 
                    value={data.output_times.medical} 
                    icon="⏱️"
                  />
                  <TimeCard 
                    title="Account" 
                    value={data.output_times.account} 
                    icon="⏱️"
                  />
                  <TimeCard 
                    title="Clinic" 
                    value={data.output_times.clinic} 
                    icon="⏱️"
                  />
                  <TimeCard 
                    title="Doctor" 
                    value={data.output_times.doctor} 
                    icon="⏱️"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Date Range</h2>
                <div className={styles.dateRangeContainer}>
                  <p className={styles.dateRangeText}>
                    <span className={styles.dateRangeLabel}>From:</span> {data.period===undefined?data.date:data.period.from}
                  </p>
                  <p className={styles.dateRangeText}>
                    <span className={styles.dateRangeLabel}>To:</span> {data.period===undefined?data.date:data.period.to}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
  <div className={`${styles.summaryItem} ${styles[color]}`}>
    <span className={styles.summaryIcon}>{icon}</span>
    <div>
      <p className={styles.summaryTitle}>{title}</p>
      <p className={styles.summaryValue}>{value}</p>
    </div>
  </div>
);

const TimeCard = ({ title, value, icon }: { title: string, value: string, icon: string }) => (
  <div className={styles.timeCard}>
    <div className={styles.timeCardContent}>
      <span className={styles.timeCardIcon}>{icon}</span>
      <span className={styles.timeCardTitle}>{title}</span>
    </div>
    <span className={`${styles.timeCardValue} ${
      value === 'N/A' ? styles.naValue : ''
    }`}>
      {value}
    </span>
  </div>
);

export default AnalyticsDashboard;