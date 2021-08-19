exports.up = (pgm) => {
    pgm.addConstraint('playlists', 'foreignkey_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('playlists', 'foreignkey_playlists.owner_users.id');
};
