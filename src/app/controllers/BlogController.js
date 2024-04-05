class BlogController {
    index(req, res) {
        res.render('home');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan');
    }
}

export default new BlogController();
