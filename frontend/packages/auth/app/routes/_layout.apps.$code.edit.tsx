import { Edit, useForm } from "@refinedev/antd"
import { Form, Input } from "antd"

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm();

  return <Edit
    title="Editar aplicación"
    saveButtonProps={saveButtonProps}
    wrapperProps={{
      style: {
        maxWidth: 600,
        margin: "auto",
      },
    }}
  >
    <Form 
      {...formProps} 
      layout="vertical"
      onChange={() => {
        const code = formProps?.form?.getFieldValue("code")
        if (!code) {
          const type = 'dc-'
          formProps?.form?.setFieldsValue({
            code: type + Math.random().toString(36).substring(2, 6)
          })
        }
        
      }}
    >
      <Form.Item
        label="Nombre"
        name="name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Código"
        name="code"
        rules={[
          { required: true },
          { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "El código solo puede contener letras minúsculas, números y guiones." }
        ]}
      >
        <Input disabled />
      </Form.Item>
    </Form>
  </Edit>
    
}
