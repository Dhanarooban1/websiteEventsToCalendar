export const getGoogleAuthToken = () => {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(token);
      });
    });
  };
  

  
  export const createCalendarEvent = async (token, eventData) => {
    if (!eventData.date || !eventData.startTime || !eventData.endTime) {
      throw new Error('Missing required date/time information');
    }
  
    const formatDateTime = (date, time) => {
      
      const cleanDate = date.split('T')[0];
      const cleanTime = time.includes(':') ? 
        (time.split(':').length === 2 ? `${time}:00` : time) : 
        `${time}:00:00`;
      
      return `${cleanDate}T${cleanTime}`;
    };
  
    const event = {
      summary: eventData.eventName || 'Untitled Event',
      description: eventData.description || '',
      start: {
        dateTime: formatDateTime(eventData.date, eventData.startTime),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: formatDateTime(eventData.date, eventData.endTime),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: eventData.location || '',
      conferenceData: eventData.virtualLink ? {
        createRequest: {
          requestId: Date.now().toString(),
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      } : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { 
            method: 'popup', 
            minutes: parseInt(eventData.notification) || 30 
          }
        ]
      }
    };
  
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create event: ${errorData.error?.message || response.statusText}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Calendar API Error:', error);
      throw error;
    }
  };