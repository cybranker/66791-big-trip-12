const generateEventType = () => ({
  transfer: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ],
  activity: [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ]
});

export {generateEventType};
