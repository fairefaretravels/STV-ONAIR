export default function Radio() {
  return (
    <main>
      <h1>Live Radio</h1>

      <audio controls autoPlay>
        <source src="/assets/audio/live.mp3" type="audio/mpeg" />
      </audio>
    </main>
  );
}
