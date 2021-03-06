const { isInChat } = require('../utils');
const telegram = require('../telegram');
const { date } = require('joi');

const User = require('../models').User;

module.exports = {
    index: async function(req, res) {
        users = await User.findAll({
            where: {
                role: 'user',
                status: 'active'
            }
        });
        return res.render('admin/users/index.html', {
            users
        });
    },

    ban: async function(req, res) {
        const telegramId = req.params.telegramId;
        const isInC = await isInChat(telegramId);
        if (isInC) {
            try {
                await telegram.kickChatMember(process.env.TELEGRAM_CHAT_ID, telegramId)
                await User.update({ status: "banned" }, {
                    where: {
                        telegramId
                    }
                  });
                return res.json({
                    status: '1',
                    message: 'تم حظر المستخدم بنجاح'
                })
            }
            catch(e) {
                return res.json({
                    status: '0',
                    message: 'حدث خطأ'
                })
            }
        }
        else {
            return res.json({
                status: '0',
                message: 'هذا المستخدم قد غادر المجموعة من قبل'
            })
        }
    },

    verify: async function(req, res) {
        const telegramId = req.params.telegramId;
        try {
            await User.update({ status: "active", verifiedAt: new Date() }, {
                where: {
                    telegramId
                }
                });
            return res.json({
                status: '1',
                message: 'تم تفعيل حساب المستخدم بنجاح'
            })
        }
        catch(e) {
            return res.json({
                status: '0',
                message: 'حدث خطأ في تفعيل الحساب'
            })
        }
    },

    destroy: async function name(req, res) {
        
        telegramId = req.params.telegramId;
        const isInC = await isInChat(telegramId);
        if (isInC) {
            try {
                await telegram.kickChatMember(process.env.TELEGRAM_CHAT_ID, telegramId)
            }
            catch(e) {
                //
            }
        }

        await User.destroy({
            where: {
                telegramId
            }
        });

        return res.json({
            status: '1',
            message: 'تم حذف المستخدم بنجاح'
        })
    }
}