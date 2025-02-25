import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration if needed for production
  // ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolution = searchParams.get('resolution') || '1h';
    const market = searchParams.get('market') || 'ind_wins';

    // Validate the resolution parameter to prevent SQL injection
    const validResolutions = ['1m', '1h', '1w'];
    if (!validResolutions.includes(resolution)) {
      return NextResponse.json({ error: 'Invalid resolution' }, { status: 400 });
    }

    // Validate market parameter
    const validMarkets = ['ind_wins', 'vk_century'];
    if (!validMarkets.includes(market)) {
      return NextResponse.json({ error: 'Invalid market' }, { status: 400 });
    }

    // Select the appropriate materialized view based on resolution and market
    let viewName;
    if (market === 'ind_wins') {
      // ind_wins uses market-specific view names
      switch (resolution) {
        case '1m':
          viewName = 'klines_1m_ind_wins';
          break;
        case '1h':
          viewName = 'klines_1h_ind_wins';
          break;
        case '1w':
          viewName = 'klines_1w_ind_wins';
          break;
        default:
          viewName = 'klines_1h_ind_wins';
      }
    } else if (market === 'vk_century') {
      // vk_century uses generic view names
      switch (resolution) {
        case '1m':
          viewName = 'klines_1m';
          break;
        case '1h':
          viewName = 'klines_1h';
          break;
        case '1w':
          viewName = 'klines_1w';
          break;
        default:
          viewName = 'klines_1h';
      }
    }

    // Query the appropriate materialized view
    const query = {
      text: `SELECT bucket, open, high, low, close, volume, currency_code 
             FROM ${viewName} 
             WHERE currency_code = $1
             ORDER BY bucket DESC
             LIMIT 200`,
      values: [market],
    };

    const result = await pool.query(query);
    
    // Return the data as JSON
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 