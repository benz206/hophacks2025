import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export class SMTPClient {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  /**
   * Send an email
   */
  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"VAPI Assistant" <${this.config.user}>`,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      });

      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send a Google Maps result email
   */
  async sendMapResultEmail(
    to: string,
    type: 'closest_location' | 'route_directions' | 'location_info',
    data: any
  ): Promise<void> {
    let subject: string;
    let html: string;

    switch (type) {
      case 'closest_location':
        subject = `🗺️ Closest ${data.searchQuery} Found`;
        html = this.generateClosestLocationHTML(data);
        break;
      
      case 'route_directions':
        subject = `🚗 Route to ${data.destination}`;
        html = this.generateRouteDirectionsHTML(data);
        break;
      
      case 'location_info':
        subject = `📍 Location Information: ${data.name}`;
        html = this.generateLocationInfoHTML(data);
        break;
      
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    await this.sendEmail({
      to,
      subject,
      html,
      text: this.stripHTML(html),
    });
  }

  /**
   * Generate HTML for closest location results
   */
  private generateClosestLocationHTML(data: any): string {
    const { searchQuery, userLocation, results } = data;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Closest ${searchQuery} Found</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4285f4; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .location-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; }
          .distance { color: #4285f4; font-weight: bold; }
          .rating { color: #ff9800; }
          .address { color: #666; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗺️ Closest ${searchQuery} Found</h1>
          </div>
          <div class="content">
            <p>Here are the closest <strong>${searchQuery}</strong> locations near ${userLocation}:</p>
            
            ${results.map((result: any, index: number) => `
              <div class="location-card">
                <h3>${result.name}</h3>
                <p class="address">📍 ${result.formatted_address}</p>
                <p class="distance">📏 Distance: ${result.distance}</p>
                ${result.rating ? `<p class="rating">⭐ Rating: ${result.rating}/5</p>` : ''}
                ${result.phone ? `<p>📞 Phone: ${result.phone}</p>` : ''}
                ${result.website ? `<p>🌐 <a href="${result.website}">Visit Website</a></p>` : ''}
                <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.formatted_address)}" target="_blank">View on Google Maps</a></p>
              </div>
            `).join('')}
            
            <p><small>Results generated on ${new Date().toLocaleString()}</small></p>
          </div>
          <div class="footer">
            <p>This email was sent by your VAPI Assistant</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML for route directions
   */
  private generateRouteDirectionsHTML(data: any): string {
    const { origin, destination, route } = data;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Route to ${destination}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #34a853; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .route-summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .step { border-left: 3px solid #34a853; padding: 10px; margin: 10px 0; }
          .step-number { background: #34a853; color: white; border-radius: 50%; width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Route to ${destination}</h1>
          </div>
          <div class="content">
            <div class="route-summary">
              <h3>Route Summary</h3>
              <p><strong>From:</strong> ${origin}</p>
              <p><strong>To:</strong> ${destination}</p>
              <p><strong>Distance:</strong> ${route.distance.text}</p>
              <p><strong>Duration:</strong> ${route.duration.text}</p>
            </div>
            
            <h3>Turn-by-turn Directions:</h3>
            ${route.steps.map((step: any, index: number) => `
              <div class="step">
                <span class="step-number">${index + 1}</span>
                <strong>${step.instructions}</strong>
                <br><small>${step.distance.text} • ${step.duration.text}</small>
              </div>
            `).join('')}
            
            <p><a href="https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}" target="_blank">View Route on Google Maps</a></p>
            
            <p><small>Directions generated on ${new Date().toLocaleString()}</small></p>
          </div>
          <div class="footer">
            <p>This email was sent by your VAPI Assistant</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML for location information
   */
  private generateLocationInfoHTML(data: any): string {
    const { name, address, location, details } = data;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Location: ${name}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ea4335; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .info-card { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📍 ${name}</h1>
          </div>
          <div class="content">
            <div class="info-card">
              <h3>Location Details</h3>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Coordinates:</strong> ${location.lat}, ${location.lng}</p>
              ${details.rating ? `<p><strong>Rating:</strong> ⭐ ${details.rating}/5</p>` : ''}
              ${details.phone ? `<p><strong>Phone:</strong> ${details.phone}</p>` : ''}
              ${details.website ? `<p><strong>Website:</strong> <a href="${details.website}">${details.website}</a></p>` : ''}
              ${details.hours ? `<p><strong>Hours:</strong> ${details.hours}</p>` : ''}
            </div>
            
            <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank">View on Google Maps</a></p>
            
            <p><small>Information retrieved on ${new Date().toLocaleString()}</small></p>
          </div>
          <div class="footer">
            <p>This email was sent by your VAPI Assistant</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Strip HTML tags for plain text version
   */
  private stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return false;
    }
  }
}

/**
 * Create SMTP client using environment variables
 */
export function createSMTPClient(): SMTPClient {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables are required');
  }

  return new SMTPClient({
    host,
    port,
    secure: port === 465, // Use SSL for port 465
    user,
    password,
  });
}
