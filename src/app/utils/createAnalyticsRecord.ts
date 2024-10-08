
import { Analytics } from '../modules/analytics/analytics.model';
import { IAnalytics } from '../modules/analytics/analytics.interface';





// Utility function to create an analytics record
 const createAnalyticsRecord = async (payload: IAnalytics, session: any) => {
  try {
    

    const analyticsData = {
      ...payload,
      timestamp: new Date(), 
    };

    // Save the analytics record to the database
    await Analytics.create([analyticsData], { session });

    
  } catch (error: any) {
    console.error('Error creating analytics record:', error.message);
    throw error;
  }
};

export default createAnalyticsRecord
