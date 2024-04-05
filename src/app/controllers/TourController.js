class BlogController {
    index(req, res) {
        res.render('tour');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan tour');
    }
}

export default new BlogController();
