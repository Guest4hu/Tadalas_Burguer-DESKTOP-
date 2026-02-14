


class SessionManager {
    static setSession(userData) {
        localStorage.setItem('session', JSON.stringify(userData));
    }

}