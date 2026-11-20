module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    trains: [
      {
        number: "12627",
        name: "Karnataka Express",
        departs: "21:20",
        arrives: "05:10",
        availability: "Available",
        book_url: "https://www.irctc.co.in/",
      },
      {
        number: "12607",
        name: "Lalbagh Express",
        departs: "15:30",
        arrives: "21:00",
        availability: "Waiting",
        book_url: "https://www.irctc.co.in/",
      },
      {
        number: "12007",
        name: "Shatabdi Express",
        departs: "06:00",
        arrives: "10:55",
        availability: "Available",
        book_url: "https://www.irctc.co.in/",
      },
    ],
    buses: [
      { operator: "KSRTC", note: "Karnataka State Road Transport Corporation", url: "https://ksrtc.in/" },
      { operator: "MSRTC", note: "Maharashtra State Road Transport Corporation", url: "https://msrtc.maharashtra.gov.in/" },
      { operator: "redBus", note: "Compare private & state bus departures", url: "https://www.redbus.in/" },
    ],
    fallback_help: "139",
  });
};
