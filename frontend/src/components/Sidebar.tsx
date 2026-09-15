import "../css/Sidebar.css";

function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-wrapper">
          <div className="sidebar-header">
            <div className="sidebar-header-text">Library</div>
            <div className="sidebar-add-playlist">
              <h4>+</h4>
            </div>
          </div>

          <div className="sidebar-item-container">
            <div className="sidebar-playlist-card">
              <div className="playlist-header">
                <h4>Playlist 1</h4>
              </div>
              <div className="playlist-info">
                <div className="playlist-song-amount">24 tracks</div>
              </div>
            </div>

            <div className="sidebar-playlist-card">
              <div className="playlist-header">
                <h4>Playlist 2</h4>
              </div>
              <div className="playlist-info">
                <div className="playlist-song-amount">22 tracks</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
