import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration if needed for production
  // ssl: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract trade data from the request
    const { market, price, volume } = body;
    
    // Validate required fields
    if (!market || price === undefined || volume === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: market, price, and volume are required' }, 
        { status: 400 }
      );
    }
    
    // Validate market parameter
    const validMarkets = ['ind_wins', 'vk_century'];
    if (!validMarkets.includes(market)) {
      return NextResponse.json({ error: 'Invalid market' }, { status: 400 });
    }
    
    // Validate price and volume values
    if (typeof price !== 'number' || typeof volume !== 'number') {
      return NextResponse.json(
        { error: 'Price and volume must be numeric values' }, 
        { status: 400 }
      );
    }
    
    if (price <= 0 || volume <= 0) {
      return NextResponse.json(
        { error: 'Price and volume must be positive values' }, 
        { status: 400 }
      );
    }
    
    // Current timestamp for the trade
    const timestamp = new Date();
    
    // Select the appropriate table based on the market
    const tableName = market === 'ind_wins' ? 'ind_wins_prices' : 'vk_century_prices';
    
    // Insert the trade data into the appropriate table
    const query = {
      text: `INSERT INTO ${tableName} (time, price, volume, currency_code) 
             VALUES ($1, $2, $3, $4)`,
      values: [timestamp, price, volume, market],
    };
    
    await pool.query(query);
    
    // Refresh the materialized views to include the new data
    // Note: In a production environment, you might want to do this on a schedule
    // rather than on every trade to avoid performance issues
    const viewPrefix = market === 'ind_wins' ? 'klines_' : 'klines_';
    const viewSuffix = market === 'ind_wins' ? '_ind_wins' : '';
    
    await pool.query(`REFRESH MATERIALIZED VIEW ${viewPrefix}1m${viewSuffix}`);
    await pool.query(`REFRESH MATERIALIZED VIEW ${viewPrefix}1h${viewSuffix}`);
    await pool.query(`REFRESH MATERIALIZED VIEW ${viewPrefix}1w${viewSuffix}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Trade recorded successfully',
      data: {
        market,
        price,
        volume,
        timestamp
      }
    });
    
  } catch (error) {
    console.error('Database error while recording trade:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
} 