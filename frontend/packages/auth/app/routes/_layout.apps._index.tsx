import { List, useSimpleList, EditButton, ShowButton } from "@refinedev/antd";
import { Card, Space, List as ListAnt, Button } from "antd";

export default function BlogPostList() {
  const { listProps } = useSimpleList()

  const goToApp = (item: any) => {
    const domain = window.location.host.split('.').slice(-2).join('.')
    const protocol = window.location.protocol
    return `${protocol}//dc.${domain}/${item.code}`
  }
  return <List
    title="Mis aplicaciones"
    wrapperProps={{
      style: {
        maxWidth: 1200,
        margin: "auto",
      },
    }}
  >
    <ListAnt 
      {...listProps}
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
      renderItem={(item) => (
        <ListAnt.Item>
          <Card
            bordered={false}
            hoverable
            actions={[
              <EditButton type="ghost" recordItemId={item.id} />,
              <Button  type="ghost" href={goToApp(item)}> Ir </Button >,
            ]}
          >
            <Card.Meta 
              description={item.name}
            />
          </Card>
        </ListAnt.Item>
      )}
    />
  </List>
}
