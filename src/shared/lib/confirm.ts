import { Modal } from 'ant-design-vue'

export type ConfirmType = 'default' | 'info' | 'success' | 'warning' | 'error'

export interface ConfirmOptions {
    /** Заголовок диалога (обязательно) */
    title: string
    /** Текст в теле диалога */
    content?: string
    /** Подпись кнопки подтверждения */
    positiveText?: string
    /** Подпись кнопки отмены */
    negativeText?: string
    /** Семантический тип (иконка и акцент) */
    type?: ConfirmType
    /** Закрывать по клику по маске */
    maskClosable?: boolean
}

const DEFAULT_POSITIVE = 'Подтвердить'
const DEFAULT_NEGATIVE = 'Отмена'

function getModalMethod(type: ConfirmType): typeof Modal.confirm {
    switch (type) {
        case 'info':
            return Modal.info
        case 'success':
            return Modal.success
        case 'warning':
            return Modal.warning
        case 'error':
            return Modal.error
        default:
            return Modal.confirm
    }
}

/**
 * Показывает диалог подтверждения. Возвращает true при нажатии «Подтвердить», иначе false.
 * @param options - Заголовок, текст, подписи кнопок, тип
 * @returns Promise с результатом выбора пользователя
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
    const {
        title,
        content,
        positiveText = DEFAULT_POSITIVE,
        negativeText = DEFAULT_NEGATIVE,
        type = 'default',
        maskClosable = true
    } = options

    const method = getModalMethod(type)

    return new Promise((resolve) => {
        method({
            title,
            content: content ?? undefined,
            okText: positiveText,
            cancelText: negativeText,
            okType: type === 'error' ? 'danger' : 'primary',
            maskClosable,
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            }
        })
    })
}

confirm.info = (options: Omit<ConfirmOptions, 'type'>) => confirm({ ...options, type: 'info' })
confirm.success = (options: Omit<ConfirmOptions, 'type'>) => confirm({ ...options, type: 'success' })
confirm.warning = (options: Omit<ConfirmOptions, 'type'>) => confirm({ ...options, type: 'warning' })
confirm.danger = (options: Omit<ConfirmOptions, 'type'>) => confirm({ ...options, type: 'error' })
