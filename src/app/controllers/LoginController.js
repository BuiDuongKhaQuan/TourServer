class BlogController {
    index(req, res) {
        res.render('login');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan login');
    }
}

export default new BlogController();
