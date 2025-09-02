# 🥊 Boxing Timer

A professional boxing timer web application built with Next.js, TypeScript, and Tailwind CSS. Perfect for boxing training, sparring sessions, and fight simulations.

## Features

### ⏱️ Timer Functionality
- **Round Management**: Configurable number of rounds (1-15)
- **Custom Durations**: Set round and rest period lengths
- **Progress Tracking**: Visual progress bar and round counter
- **Auto-Transitions**: Automatic switching between rounds and rest periods

### 🎵 Custom Sound System
- **Upload Custom Sounds**: Add your own audio files (MP3, WAV, OGG)
- **Sound Triggers**: 
  - Round end bell sound
  - 10-second warning alert
- **Sound Management**: Play, rename, and remove custom sounds
- **File Size Limit**: Up to 10MB per audio file

### ⚙️ Configuration Options
- **Quick Presets**: Amateur, Professional, Title Fight, Quick Workout
- **Custom Settings**: Fine-tune round and rest durations
- **Time Format**: MM:SS input format with validation
- **Total Time Display**: Shows complete workout duration

### 🎨 Modern UI
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Professional boxing ring aesthetic
- **Smooth Animations**: Visual feedback and transitions
- **Accessibility**: Keyboard navigation and focus indicators

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boxing-timer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Basic Timer Operation
1. **Configure Settings**: Choose rounds, duration, and rest time
2. **Start Fight**: Click "Start Fight" to begin the timer
3. **Monitor Progress**: Watch the countdown and progress bar
4. **Sound Alerts**: Listen for warning (10s) and bell (round end) sounds

### Adding Custom Sounds
1. **Upload Audio**: Use the sound manager to upload audio files
2. **Name Sounds**: Name them "bell" for round end or "warning" for alerts
3. **Test Sounds**: Click the play button to preview
4. **Manage Library**: Add, remove, or rename sounds as needed

### Preset Configurations
- **Amateur**: 3 rounds, 2:00 each, 1:00 rest
- **Professional**: 12 rounds, 3:00 each, 1:00 rest  
- **Title Fight**: 12 rounds, 3:00 each, 1:00 rest
- **Quick Workout**: 6 rounds, 2:00 each, 0:30 rest

## Technical Details

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Audio**: Web Audio API

### File Structure
```
src/
├── app/
│   ├── components/
│   │   ├── Timer.tsx          # Main timer component
│   │   ├── SoundManager.tsx   # Custom sound management
│   │   └── RoundSettings.tsx  # Configuration panel
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # App layout
│   └── page.tsx               # Main page
public/
└── sounds/                    # Default sound files
```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Ready to train like a champion? Start your boxing timer now!** 🥊
