class BlogController {
    index(req, res) {
        res.render('des');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan des');
    }
}

export default new BlogController();
