import "../../../styles/recycle.css";

const RecycleView = {
  render() {
    return `
      <section class="recycle-section container">
        <h1 class="recycle-title">Ayo cari bank sampah terdekatmu!</h1>
        <button id="locate-button" class="recycle-button">Recycle</button>
        <div id="map-container"></div>
      </section>
    `;
  },
};

export default RecycleView;
