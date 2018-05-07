function resFactory() {
    const res = {};
    const status = jest.fn();
    const json = jest.fn((value) => value);

    status.mockReturnValueOnce({status: json});
    res.status = status;
}

module.exports.resFactory = resFactory;