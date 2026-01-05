# Vaccination Schedule Tracker for children

A simple, offline-first vaccination tracking app for  children following Ministry of Health guidelines.

**Live Demo**: [Your Demo URL]

## Quick Start

```bash
# Clone and run
git clone https://github.com/yourusername/vaccination-tracker-kenya.git
cd vaccination-tracker-kenya
open vaccination-tracker.html
```

That's it! No build tools, no dependencies, no npm install.

## Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling (Flexbox, Grid)
- **Vanilla JavaScript** - All functionality
- **localStorage** - Data persistence

## Features

- Track 20 vaccines (Kenya MOH schedule as model but any country's schedule can be added)
- Multiple children support
- Smart status tracking (Completed, Due, Overdue, Upcoming)
- 100% offline functionality
- Mobile-responsive
- Privacy-first (all data local)

## File Structure

```
day_5_child_vaccination_scheduler/
├── index.html    # Single-file app
├── style.css     # Stylesheet
├── script.js     # All JS functionality
├── README.md     # This file 
```


## Customization

### Add Your Country's Schedule

Edit the `VACCINE_SCHEDULE` array:

```javascript
const VACCINE_SCHEDULE = [
    { 
        name: 'BCG', 
        age: 0,                    // Age in weeks
        ageText: 'At Birth',
        description: 'Protection against tuberculosis',
        disease: 'Tuberculosis'
    },
    // Add more vaccines...
];
```

### Change Colors

```css
.vaccine-card.completed { border-left-color: #48bb78; }  /* Green */
.vaccine-card.due-soon { border-left-color: #ed8936; }   /* Orange */
.vaccine-card.overdue { border-left-color: #f56565; }    /* Red */
```

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature-name`
3. Make changes (vanilla JS only, no frameworks)
4. Test on mobile devices
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Open Pull Request

### Code Guidelines

- Use vanilla JavaScript (no libraries/frameworks)
- Comment complex logic
- Keep functions small and focused
- Maintain mobile responsiveness
- Test on multiple browsers
- Preserve offline functionality


## License

MIT License - use freely, modify, distribute.

## Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/vaccination-tracker-kenya/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)


**Part of 90-Day Coding Challenge for African Development** | Day 5 of 90